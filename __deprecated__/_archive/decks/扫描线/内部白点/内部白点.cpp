#include<algorithm>
#include<iostream>
#include<cstring>
#include<cstdio>
#include<vector>
#include<map>
using namespace std;

namespace FastIO{
	const int L=(1<<20);
	char buf[L],*S,*T;
	#ifdef ONLINE_JUDGE
	inline char getchar(){
		if(S==T){T=(S=buf)+fread(buf,1,L,stdin);if(S==T)return EOF;}
		return *S++;
	}
	#endif
	inline int read(){
		int s=0,f=1;char t=getchar();
		while('0'>t||t>'9'){if(t=='-')f=-1;t=getchar();}
		while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=getchar();}
		return s*f;
	}
}
using FastIO::read;

const int N=100005;
int Ls[N],Lsn,n; 

struct TArray{
	int sm[N];
	int lowbit(int x){return x&(-x);}
	int sum(int x){
		int ans=0;
		for(int i=x;i>0;i-=lowbit(i))
			ans+=sm[i];
		return ans;
	}
	int sum(int l,int r){
		return sum(r)-sum(l-1);
	}
	void add(int x,int d){
		for(int i=x;i<=Lsn;i+=lowbit(i))
			sm[i]+=d;
	}
}T;

struct Node{
	int x,y;
}d[N];

struct Operation{
	int type;
	int y;
	int l,r;
	int pos,d;
};
vector<Operation> ops;

Operation QueryOperation(int y,int l,int r){
	return (Operation){1,y,l,r,0,0};
}

Operation AddOperation(int y,int pos,int d){
	return (Operation){2,y,0,0,pos,d};
}

bool cmp(const Operation& a,const Operation& b){
	if(a.y!=b.y)return a.y<b.y;
	return a.type>b.type;
}

bool cmpXY(const Node& a,const Node& b){
	if(a.x!=b.x)return a.x<b.x;
	return a.y<b.y;
}

bool cmpYX(const Node& a,const Node& b){
	if(a.y!=b.y)return a.y<b.y;
	return a.x<b.x;
}

void FindVertical(){
	sort(d+1,d+1+n,cmpXY);
	for(int l=1,r;l<=n;l=r+1){
		r=l;
		while(r+1<=n&&d[r+1].x==d[l].x)r++;
		for(int i=l;i<r;i++){
			int pos=d[i].x;
			int y1=d[i].y;
			int y2=d[i+1].y;
			ops.push_back(AddOperation(y1+1,pos,1));
			ops.push_back(AddOperation(y2,pos,-1));
		}
	}
}

void FindHorizontal(){
	sort(d+1,d+1+n,cmpYX);
	for(int l=1,r;l<=n;l=r+1){
		r=l;
		while(r+1<=n&&d[r+1].y==d[l].y)r++;
		int L=d[l].x;
		int R=d[r].x;
		int y=d[l].y;
		ops.push_back(QueryOperation(y,L,R));
	}
}

int Solve(){
	sort(ops.begin(),ops.end(),cmp);
	int ans=0;
	for(int i=0;i<ops.size();i++){
		if(ops[i].type==1){
			ans+=T.sum(ops[i].l,ops[i].r);
		}else{
			T.add(ops[i].pos,ops[i].d);
		}
	}
	return ans+n;
}

int main(){
	n=read();
	for(int i=1;i<=n;i++){
		d[i].x=read();
		d[i].y=read();
		Ls[++Lsn]=d[i].x;
	}
	sort(Ls+1,Ls+1+Lsn);
	Lsn=unique(Ls+1,Ls+1+Lsn)-Ls-1;
	for(int i=1;i<=n;i++)
		d[i].x=lower_bound(Ls+1,Ls+1+Lsn,d[i].x)-Ls;
	FindHorizontal();
	FindVertical();
	cout<<Solve()<<'\n';
	return 0;
}
