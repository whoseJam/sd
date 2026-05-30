#include<algorithm>
#include<iostream>
#include<cstring>
#include<cstdio>
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

const int N=50005;
int n,tot,Ls[N],Lsn;

struct TArray{
	int sm[N];
	int lowbit(int x){
		return x&(-x);
	}
	void add(int x,int d){
		for(int i=x;i<=Lsn;i+=lowbit(i))
			sm[i]=max(sm[i],d);
	}
	int ask(int x){
		int ans=0;
		for(int i=x;i>0;i-=lowbit(i))
			ans=max(ans,sm[i]);
		return ans;
	}
	void clear(int x){
		for(int i=x;i<=Lsn;i+=lowbit(i))
			sm[i]=0;
	}
}T;

struct node{
	int a,b,c,d,e;
	int cnt,f;
	int type;
}d[N];

bool cmpA(const node& a,const node& b){
	if(a.a!=b.a)return a.a<b.a;
	if(a.b!=b.b)return a.b<b.b;
	if(a.c!=b.c)return a.c<b.c;
	if(a.d!=b.d)return a.d<b.d;
	return a.e<b.e;
}

bool cmpB(const node& a,const node& b){
	if(a.b!=b.b)return a.b<b.b;
	if(a.c!=b.c)return a.c<b.c;
	if(a.d!=b.d)return a.d<b.d;
	return a.e<b.e;
}

bool cmpC(const node& a,const node& b){
	if(a.c!=b.c)return a.c<b.c;
	if(a.d!=b.d)return a.d<b.d;
	return a.e<b.e;
}

void CDQ2(int l,int r){ // d[l~mid].b <= d[mid+1~r].b
	if(l==r)return;
	int mid=(l+r)>>1;
	CDQ2(l,mid);
	int cur=l-1;
	sort(d+l,d+mid+1,cmpC);
	sort(d+mid+1,d+r+1,cmpC);
	for(int i=mid+1;i<=r;i++){
		while(cur+1<=mid&&d[cur+1].c<=d[i].c){ // d[cur].c <= d[i].c
			cur++;
			if(d[cur].type==1)
				T.add(d[cur].d,d[cur].f);
		}
		if(d[i].type==2)
			d[i].f=max(d[i].f,T.ask(d[i].d)+d[i].cnt);
	}
	for(int i=l;i<=cur;i++)
		if(d[i].type==1)T.clear(d[i].d);
	sort(d+l,d+r+1,cmpB);
	CDQ2(mid+1,r);
}

void CDQ1(int l,int r){ // d[l~mid].a <= d[mid+1~r].a
	if(l==r)return;
	int mid=(l+r)>>1;
	CDQ1(l,mid);
	for(int i=l;i<=mid;i++)
		d[i].type=1;
	for(int i=mid+1;i<=r;i++)
		d[i].type=2;
	sort(d+l,d+r+1,cmpB); 
	CDQ2(l,r); // d[type1].a<=d[type2].a
	sort(d+l,d+r+1,cmpA);
	CDQ1(mid+1,r);
}

int main(){
	n=read();
	for(int i=1;i<=n;i++){
		d[i].a=read();
		d[i].b=read();
		d[i].c=read();
		d[i].d=read();
		d[i].cnt=d[i].f=1;
	}
	sort(d+1,d+1+n,cmpA);
	
	tot=1;
	for(int i=2;i<=n;i++){
		if(d[i].a==d[tot].a&&
		   d[i].b==d[tot].b&&
		   d[i].c==d[tot].c&&
		   d[i].d==d[tot].d){
			d[tot].cnt++;
			d[tot].f++;
		}else d[++tot]=d[i];
	}
	for(int i=1;i<=tot;i++){
		Ls[++Lsn]=d[i].d;
		d[i].e=i;
	}
	sort(Ls+1,Ls+1+Lsn);
	Lsn=unique(Ls+1,Ls+1+Lsn)-Ls-1;
	for(int i=1;i<=tot;i++)
		d[i].d=lower_bound(Ls+1,Ls+1+Lsn,d[i].d)-Ls;
	CDQ1(1,tot);
	
	int ans=0;
	for(int i=1;i<=tot;i++)
		ans=max(ans,d[i].f);
	cout<<ans<<'\n';
	return 0;
}

