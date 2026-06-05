#include<algorithm>
#include<iostream>
#include<cstring>
#include<cstdio>
#include<set> 
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

const int inf=2147483647;
const int N=300005;
int Ls[N],Lsn;
int n,m,a[N],x[N],y[N],now[N],ans=inf;
set<int> S[N];

void insert(set<int>& S,int pos){
	auto it=S.insert(pos).first;
	if(it!=S.begin()){
		auto prev=it;
		prev--;
		ans=min(ans,pos-(*prev));
	}
	auto next=it;
	next++;
	if(next!=S.end())ans=min(ans,(*next)-pos);
}

void Merge(set<int>& A,set<int>& B){
	for(auto p:A)insert(B,p);
	A.clear();
}

int main(){
	n=read();m=read();
	for(int i=1;i<=n;i++)
		Ls[++Lsn]=a[i]=read();
	for(int i=1;i<=m;i++){
		Ls[++Lsn]=x[i]=read();
		Ls[++Lsn]=y[i]=read();
	}
	sort(Ls+1,Ls+1+Lsn);
	Lsn=unique(Ls+1,Ls+1+Lsn)-Ls-1;
	for(int i=1;i<=n;i++)
		a[i]=lower_bound(Ls+1,Ls+1+Lsn,a[i])-Ls;
	for(int i=1;i<=m;i++){
		x[i]=lower_bound(Ls+1,Ls+1+Lsn,x[i])-Ls;
		y[i]=lower_bound(Ls+1,Ls+1+Lsn,y[i])-Ls;
	}
	for(int i=1;i<=Lsn;i++)now[i]=i;
	
	for(int i=1;i<=n;i++)
		insert(S[a[i]],i);
	for(int i=1;i<=m;i++){
		int X=x[i];
		int Y=y[i];
		if(S[now[X]].size()>S[now[Y]].size())swap(now[X],now[Y]);
		Merge(S[now[X]],S[now[Y]]);
		cout<<ans<<'\n';
	}
	return 0;
}

